export type SignInRequestDTO = {
  email: string;
  password: string;
};

export type AuthUserDTO = {
  id: string;
  email: string;
  name: string;
  role: string;
  mustChangePassword: boolean;
};

export type AuthTokensDTO = {
  access_token: string;
  refresh_token: string;
  user: AuthUserDTO;
};

export type ApiSuccessResponseDTO<TPayload> = {
  success: boolean;
  message: string;
  payload: TPayload;
};

export type SignInPayloadDTO = AuthTokensDTO;

export type SignInResponseDTO = {
  success: boolean;
  message: string;
  payload: SignInPayloadDTO;
};

export type VerifyLoginCodeRequestDTO = {
  code: string;
};

export type VerifyCodeRequiresPasswordChangePayloadDTO = {
  requiresPasswordChange: true;
};

export type VerifyCodeAuthenticatedPayloadDTO = {
  requiresPasswordChange: false;
} & AuthTokensDTO;

export type VerifyCodePayloadDTO =
  | VerifyCodeRequiresPasswordChangePayloadDTO
  | VerifyCodeAuthenticatedPayloadDTO;

export type VerifyLoginCodeResponseDTO =
  ApiSuccessResponseDTO<VerifyCodePayloadDTO>;

export type FirstTimeChangePasswordRequestDTO = {
  newPassword: string;
};

export type FirstTimeChangePasswordResponseDTO = ApiSuccessResponseDTO<null>;

export type ApiErrorDTO = {
  message: string;
  error: string;
  statusCode: number;
};

export type ForgotPasswordRequestDTO = {
  email: string;
};

export type ForgotPasswordPayloadDTO = {
  message: string;
  resetToken?: string;
};

export type ForgotPasswordResponseDTO =
  ApiSuccessResponseDTO<ForgotPasswordPayloadDTO>;

// Used by the first-login / password-not-received flow where the temporary
// password acts as the verification code alongside the reset token.
export type ChangePasswordFromTemporaryRequestDTO = {
  resetToken: string;
  code: string;
  newPassword: string;
};

export type VerifyResetCodeRequestDTO = {
  resetToken: string;
  code: string;
};

export type VerifyResetCodePayloadDTO = {
  verified: boolean;
};

export type VerifyResetCodeResponseDTO =
  ApiSuccessResponseDTO<VerifyResetCodePayloadDTO>;

export type ResetPasswordRequestDTO = {
  resetToken: string;
  newPassword: string;
};

export type ResetPasswordResponseDTO = ApiSuccessResponseDTO<null>;

export type FirstAccessValidateRequestDTO = {
  token: string;
};

export type FirstAccessValidatePayloadDTO = {
  email: string;
  name: string;
};

export type FirstAccessValidateResponseDTO =
  ApiSuccessResponseDTO<FirstAccessValidatePayloadDTO>;

// Step 1: verify temp password + terms acceptance
export type FirstAccessVerifyRequestDTO = {
  token: string;
  currentPassword: string;
  termsAccepted: boolean;
};

export type FirstAccessVerifyPayloadDTO = {
  verified: boolean;
};

export type FirstAccessVerifyResponseDTO =
  ApiSuccessResponseDTO<FirstAccessVerifyPayloadDTO>;

// Step 2: set new password
export type FirstAccessCompleteRequestDTO = {
  token: string;
  newPassword: string;
};

export type FirstAccessCompletePayloadDTO = {
  success: boolean;
};

export type FirstAccessCompleteResponseDTO =
  ApiSuccessResponseDTO<FirstAccessCompletePayloadDTO>;

// Resend first-access link
export type FirstAccessRequestDTO = {
  email: string;
};

export type FirstAccessRequestPayloadDTO = {
  success: boolean;
};

export type FirstAccessRequestResponseDTO =
  ApiSuccessResponseDTO<FirstAccessRequestPayloadDTO>;
