import { SignIn } from '@stackframe/stack';
import Link from 'next/link';
import React from 'react';

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <SignIn />
        <Link href="/">
          <button>Go back</button>
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;
