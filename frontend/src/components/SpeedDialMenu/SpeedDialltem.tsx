import styles from './SpeedDialMenu.module.css';

type SpeedDialItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

export const SpeedDialItem: React.FC<SpeedDialItemProps> = ({ icon, label, onClick }) => {
  return (
    <div className={styles.action} onClick={onClick} title={label}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.tooltip}>{label}</span>
    </div>
  );
}