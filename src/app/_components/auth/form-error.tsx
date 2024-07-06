"use client";

const FormError = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full items-center rounded-xl bg-red-800 p-3 text-sm text-white">
      {children}
    </div>
  );
};

export default FormError;
