'use client';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function VisibilityToggle({ id, tableName, initialValue }) {
  const router = useRouter();
  const [isOn, setIsOn] = useState(initialValue !== false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from(tableName)
      .update({ showOnHome: !isOn })
      .eq('id', id);

    if (!error) {
      setIsOn(!isOn);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-2 rounded-lg transition-all ${
        isOn ? 'text-accent bg-accent/10' : 'text-gray-600 bg-white/5'
      }`}
      title={isOn ? "Tampil di Home" : "Disembunyikan"}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : (
        isOn ? <Eye size={18} /> : <EyeOff size={18} />
      )}
    </button>
  );
}
