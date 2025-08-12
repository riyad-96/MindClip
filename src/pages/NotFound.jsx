import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="height-dvh px-8 font-[poppins]">
      <div className="mx-auto max-w-[800px] space-y-8 pt-18">
        <h2 onClick={() => navigate('/home/notes')} className="mx-auto w-fit cursor-pointer text-center text-3xl font-medium select-none md:text-[2.325rem]">
          ZeroNote
        </h2>
        <div className="relative">
          <img className="w-full grayscale-100" src="/undraw_page-not-found_6wni.svg" alt="" />
          <span className="absolute inset-0 z-5"></span>
        </div>

        <p className="text-center text-xl">Page not found.</p>

        <button onClick={() => navigate('/home/notes')} className="mx-auto block cursor-pointer rounded-full border border-zinc-300 bg-zinc-100 px-6 py-2 text-sm font-medium transition-[color,background-color,box-shadow] dark:border-zinc-700 dark:bg-zinc-800 [@media(pointer:fine)]:hover:bg-zinc-200 [@media(pointer:fine)]:hover:shadow-md dark:[@media(pointer:fine)]:hover:bg-zinc-700">
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
