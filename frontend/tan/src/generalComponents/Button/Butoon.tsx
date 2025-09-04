import {type Props} from './ButtonTypes'
import './Button.css';

const Button = ({label, onClick, className, type, disabled, icon, form} : Props) => {

    return (
        <button 
        onClick={onClick} 
        className={`${className || ''} ${icon ? 'button-with-icon' : ''}`} 
        type={type} 
        disabled={disabled}
        form={form}
        >
            {icon && <span className="material-icons">{icon}</span>}
            {label && <span className="button-text">{label}</span>}
        </button>
    )
}

export default Button;