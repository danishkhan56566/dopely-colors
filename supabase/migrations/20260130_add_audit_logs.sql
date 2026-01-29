-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    operator_id uuid REFERENCES auth.users(id),
    operator_email text,
    action text NOT NULL,
    details text,
    payload jsonb,
    context text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all logs
CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- System/Server Actions can insert (using service role, or we can allow authenticated admins to insert via action)
-- Note: Service role bypasses RLS, so server actions using createAdminClient will work.

-- Update admin_permissions table if needed (it should already be there from previous migration)
-- But ensuring updated_at trigger is robust
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_admin_permissions_updated_at ON admin_permissions;
CREATE TRIGGER tr_admin_permissions_updated_at
    BEFORE UPDATE ON admin_permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
