type Props = {
  type?: string;
  title: string;
  placeholder: string;
  isTextArea?: boolean;
  state: string;
  setState: (value: string) => void;
};

const FormField = ({
  type,
  title,
  placeholder,
  isTextArea,
  state,
  setState,
}: Props) => {
  return (
    <div className="flexStart flex-col w-full gap-4">
      <label className="w-full text-gray-100">{title}</label>
      {isTextArea ? (
        <textarea
          placeholder={placeholder}
          value={state}
          required
          className="form_field-input"
          onChange={(e) => setState(e.target.value)}
        />
      ) : (
        <input
          type={type || "text"}
          placeholder={placeholder}
          value={state}
          required
          className="form_field-input"
          onChange={(e) => setState(e.target.value)}
        />
      )}
      {/* <input></input> */}
    </div>
  );
};

export default FormField;
