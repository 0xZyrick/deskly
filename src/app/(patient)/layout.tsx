import { BookingProvider } from "@/lib/booking/context";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>;
}
