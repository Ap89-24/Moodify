import "../style/login.scss";

const FormGroup = ({ label , placeholder , value , onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor={label}>{label}</label>
      <input type="text" id={label} placeholder={placeholder} value={value} onChange={onChange} required />
    </div>
  )
}

export default FormGroup
