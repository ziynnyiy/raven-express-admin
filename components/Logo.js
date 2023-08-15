import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex  gap-1.5">
      <img
        className="w-6 h-6"
        src="https://test-for-aws-course-only.s3.ap-southeast-2.amazonaws.com/icons8-bird-48+(1).png"
        alt="logo"
      />
      <span className="">Raven Express </span>
    </Link>
  );
}
