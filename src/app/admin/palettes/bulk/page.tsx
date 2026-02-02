
import { createClient } from '@/lib/supabase-server';
import BulkUploadClient from './BulkUploadClient';

export default async function BulkUploadPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return <BulkUploadClient initialUser={user} />;
}
