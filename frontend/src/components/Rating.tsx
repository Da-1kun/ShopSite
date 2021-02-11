interface Props {
  value: number;
  text: string;
  color: string;
}

function getClassName(value: number, threshold: number): string {
  return value >= threshold
    ? 'fas fa-star'
    : value >= threshold - 0.5
    ? 'fas fa-star-half-alt'
    : 'far fa-star';
}

const Rating: React.FC<Props> = ({ value, text, color }: Props) => {
  const thresholds = [...Array(5)].map((_, i) => i + 1);

  return (
    <div className="rating">
      <span>
        {thresholds.map(threshold => (
          <i
            key={threshold}
            style={{ color }}
            className={getClassName(value, threshold)}
          ></i>
        ))}
      </span>
      <span>{text && text}</span>
    </div>
  );
};

export default Rating;
