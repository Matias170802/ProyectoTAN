import {type Props} from './ButtonTypes'
import './Button.css';

const Button: React.FC<Props> = ({label, onClick, id, type, disabled, icon, form, className}) => {

    return (
        <button 
        onClick={onClick} 
        id={id} 
        type={type} 
        disabled={disabled}
        form={form}
        className={className}
        >
            {icon && <span className="material-icons">{icon}</span>}
            {label && <span className="button-text">{label}</span>}
        </button>
    )
}

export default Button;