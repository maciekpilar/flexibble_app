"use client";
import { ProjectInterface, SessionInterface } from "@/common.types";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import FormField from "./FormField";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import Button from "./Button";
import { createNewProject, fetchToken, updateProject } from "@/lib/actions";
import { useRouter } from "next/navigation";

type Props = {
  type: string;
  session: SessionInterface;
  project?: ProjectInterface;
};

const ProjectForm = ({ type, session, project }: Props) => {
  const router = useRouter();
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    liveSiteUrl: project?.liveSiteUrl || "",
    githubUrl: project?.githubUrl || "",
    category: project?.category || "",
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    // stopping page reload
    e.preventDefault();

    // Starting the submit process
    setIsSubmiting(true);

    // Taking the token
    const { token } = await fetchToken();

    try {
      // Create project
      if (type === "create") {
        await createNewProject(form, session?.user?.id, token);

        router.push("/");
      }

      // Edit project
      if (type === "edit") {
        await updateProject(form, project?.id as string, token);

        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    // stopping page reload
    e.preventDefault();

    // Access to the file
    const file = e.target.files?.[0];

    // IF doesn't exist
    if (!file) return;

    if (!file.type.includes("image")) {
      return alert("Please upload an image file");
    }

    // IF we have file and there is an image
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;

      handleStateChange("image", result);
    };
  };

  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  return (
    <form onSubmit={handleFormSubmit} className="flexStart form">
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form.image && "Chose a poster for your Project"}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          required={type === "create"}
          className="form_image-input"
          onChange={handleChangeImage}
        />
        {form.image && (
          <Image
            src={form?.image}
            alt="Project poster"
            className="sm:p-10 object-contain z-20"
            fill
          />
        )}
      </div>
      <FormField
        title="Title"
        placeholder="Flexibble"
        state={form.title}
        setState={(value) => handleStateChange("title", value)}
      />
      <FormField
        title="Description"
        placeholder="Showcase and discover remarkable developer projects."
        state={form.description}
        setState={(value) => handleStateChange("description", value)}
      />
      <FormField
        type="url"
        title="Website URL"
        placeholder="https://flexibble-vercel.com/flexibble"
        state={form.liveSiteUrl}
        setState={(value) => handleStateChange("liveSiteUrl", value)}
      />
      <FormField
        title="GitHub URL"
        placeholder="https://github.com/flexibble"
        state={form.githubUrl}
        setState={(value) => handleStateChange("githubUrl", value)}
      />
      <CustomMenu
        title="Category"
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange("category", value)}
      />
      <div className="flexStart w-full">
        <Button
          title={
            isSubmiting
              ? `${type === "create" ? "Creating" : "Editing"}`
              : `${type === "create" ? "Create" : "Edit"}`
          }
          type="submit"
          leftIcon={isSubmiting ? "" : "/plus.svg"}
          isSubmitting={isSubmiting}
        />
      </div>
    </form>
  );
};

export default ProjectForm;
