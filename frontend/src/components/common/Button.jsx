
import styles from '../../assets/style/Button.module.css'

function Button(props) {

    const { onClick, color, width, height, fontSize, children } = props;
    const colorClass = styles[`color_${color}`] || '';

    const dynamicStyle = {
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...(fontSize ? { fontSize } : {}),
    };

    return (
        <>
            <button
                className={`${styles.button} ${colorClass}`}
                onClick={onClick}
                style={dynamicStyle}
            >
                {children}
            </button>
        </>
    )
}
export default Button;