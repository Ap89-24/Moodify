import "../style/login.scss";

const FormGroup = ({ label , placeholder }) => {
  return (
    <div className="form-group">
      <label htmlFor={label}>{label}</label>
      <input type="text" id={label} placeholder={placeholder} />
    </div>
  )
}

export default FormGroup
