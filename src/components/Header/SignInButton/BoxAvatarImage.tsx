interface BoxAvatarImage {
  imageLink: string;
}
import styles from "./styles.module.scss";
export default function BoxAvatarImage({ imageLink }: BoxAvatarImage) {
  return (
    <div className={styles.boxAvatarImage}>
      <img src={imageLink} alt="avatar github" />
    </div>
  );
}
