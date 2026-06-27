import "./globals.css";

import {
  AuthProvider
} from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { FormModalProvider } from "@/contexts/FormModalContext";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="pt">

      <body>

        <AuthProvider>

          <ToastProvider>
            <ModalProvider>
              <FormModalProvider>
                {children}
              </FormModalProvider>
            </ModalProvider>          
          </ToastProvider>
        </AuthProvider>

      </body>

    </html>

  );
}