import spinnerStyles from '../../assets/style/LoadingOverlay.module.css';

function LoadingOverlay() {
    return (
        <div className={spinnerStyles.loadingOverlay}>
            <div className={spinnerStyles.spinner}></div>
            <p className={spinnerStyles.loadingMessage}>データを読み込み中...</p>
        </div>
    );
}

export default LoadingOverlay;