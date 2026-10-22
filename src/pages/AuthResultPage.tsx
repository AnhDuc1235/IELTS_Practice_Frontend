import { Link, useSearchParams } from 'react-router-dom';

export default function AuthResultPage() {
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type') || 'info';
  const message = searchParams.get('message') || 'Action completed';
  const next = searchParams.get('next') || '/';

  const title =
    type === 'login'
      ? 'Account Login'
      : type === 'register'
      ? 'Account Register'
      : type === 'logout'
      ? 'Account Logout'
      : type === 'profile'
      ? 'Account Information'
      : type === 'password'
      ? 'Change Password'
      : 'Account Notice';

  return (
    <div className="bg-[#f5f5f5] min-h-[65vh]">
      <div className="max-w-[1260px] mx-auto px-4 py-8">
        <section className="border border-[#d8d8d8] bg-white p-6 shadow-xs">
          <h1 className="text-[36px] font-semibold md:text-[42px] text-gray-900">
            {title}
          </h1>

          <p className="text-[16px] text-[#444] mt-4 leading-relaxed">
            {message}
          </p>

          <div className="mt-6">
            <Link
              to={next}
              className="inline-block bg-[#062962] text-white px-8 py-2.5 text-[14px] font-semibold hover:bg-[#083884] transition-colors rounded-xs"
            >
              Continue
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export { AuthResultPage };
