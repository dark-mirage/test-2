import ReviewClient from "./ReviewClient";

export const metadata = {
  title: "Оцените товар",
};

export default function ReviewPage({ params }) {
  return <ReviewClient id={params?.id} />;
}
