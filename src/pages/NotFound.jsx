export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold font-inknut">404</h1>
      <p className="text-xl mt-12 text-gray-600 font-poppins-lt">The page you’re looking for does not exist.</p>
      <a
        href="/"
        className="mt-6 text-black underline px-4 py-2 rounded-md"
      >
        Go Home
      </a>
    </div>
  );
}
