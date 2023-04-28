import styles from "./ControlPanel.module.css";

interface ControlPanelProps {
  children: React.ReactNode;
}

const ControlPanel = ({ children }: ControlPanelProps) => {
  return <aside className={styles.control_panel_wrapper}>{children}</aside>;
};

export default ControlPanel;
