import { redirect } from 'next/navigation';

export default function AddCertificationRedirect() {
  redirect('/admin/quality');
}
