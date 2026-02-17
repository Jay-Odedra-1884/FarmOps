import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">Welcome to FarmOps</h1>
      <p className="text-center mt-4 text-lg">
        Your one-stop solution for farm management and operations.
      </p>
      <div className="flex gap-5 justify-center">
        <a href="/dashboard" className="block text-center mt-6 text-blue-500 hover:underline">
        Go to Dashboard
      </a>
      <a href="/login" className="block text-center mt-6 text-blue-500 hover:underline">
        Login
      </a>
      </div>
    </div>
  );
}
