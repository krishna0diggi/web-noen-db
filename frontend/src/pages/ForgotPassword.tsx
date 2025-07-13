import React, { useState } from 'react';
import { forgotPasswordService } from '@/service/userService/userService';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

type ForgotPasswordProps = {
  phone?: string;
};

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ phone: propPhone }) => {
  const phone = propPhone || '';
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Remove local success/error, use toast

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({
        title: 'Missing Phone Number',
        description: 'Phone number is required to reset password.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPasswordService(phone, newPassword);
      toast({
        title: 'Password Updated',
        description: res?.message || 'Password updated successfully!',
        variant: 'default',
      });
    } catch (err: any) {
      toast({
        title: 'Update Failed',
        description: err?.response?.data?.message || 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 dark:bg-[#18181b]">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center w-full h-full py-20"
        >
          <span className="loader" />
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md w-full max-w-md border border-border/30 dark:border-border/60"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4 text-primary dark:text-primary-dark">
            Forgot Password
          </h2>
          {/* Phone number is taken from props and not shown as input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-zinc-800 text-foreground"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary dark:bg-primary-dark text-white py-2 rounded-md hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </motion.form>
      )}
    </div>
  );
};

export default ForgotPassword;