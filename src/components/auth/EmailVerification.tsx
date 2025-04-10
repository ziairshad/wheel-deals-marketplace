
import { Button } from "@/components/ui/button";

type EmailVerificationProps = {
  onBackToLogin: () => void;
};

const EmailVerification = ({ onBackToLogin }: EmailVerificationProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="bg-blue-50 text-blue-700 p-4 rounded-md">
        <p>A verification link has been sent to your email address. Please click the link to complete your registration.</p>
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={onBackToLogin}
      >
        Return to Login
      </Button>
    </div>
  );
};

export default EmailVerification;
