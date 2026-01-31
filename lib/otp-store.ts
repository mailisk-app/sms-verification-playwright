type OtpEntry = {
  code: string;
  phone: string;
  expiresAt: number;
};

const DEFAULT_OTP_TTL_MINUTES = 5;
const OTP_TTL_MS = resolveOtpTtlMs();

const globalStore = globalThis as typeof globalThis & {
  __otpEntry?: OtpEntry | null;
};

function getStore(): OtpEntry | null {
  return globalStore.__otpEntry ?? null;
}

function setStore(entry: OtpEntry | null) {
  globalStore.__otpEntry = entry;
}

export function saveOtp(phone: string, code: string) {
  setStore({
    phone,
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

export function consumeOtp(code: string) {
  const entry = getStore();

  if (!entry) {
    return false;
  }

  if (entry.expiresAt < Date.now()) {
    setStore(null);
    return false;
  }

  const isMatch = entry.code === code;

  if (isMatch) {
    setStore(null);
  }

  return isMatch;
}

function resolveOtpTtlMs() {
  const { OTP_TTL_MINUTES } = process.env;

  if (!OTP_TTL_MINUTES) {
    return DEFAULT_OTP_TTL_MINUTES * 60 * 1000;
  }

  const parsedMinutes = Number(OTP_TTL_MINUTES);

  if (!Number.isFinite(parsedMinutes) || parsedMinutes <= 0) {
    console.warn(
      `Invalid OTP_TTL_MINUTES value "${OTP_TTL_MINUTES}". Falling back to default (${DEFAULT_OTP_TTL_MINUTES} minutes).`,
    );
    return DEFAULT_OTP_TTL_MINUTES * 60 * 1000;
  }

  return parsedMinutes * 60 * 1000;
}
