
'use client'

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Shield, Users, Clock, CheckCircle, XCircle, AlertCircle, LogOut } from 'lucide-react';

export default function FounderDashboard() {
  const supabase = createClientComponentClient();
  const [successors, setSuccessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [founderId, setFounderId] = useState<string | null>(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (profile) {
      setFounderId(profile.id);
      loadSuccessors(profile.id);
      subscribeToRealtimeUpdates(profile.id);
    }
  };

  const loadSuccessors = async (founderId: string) => {
    const { data, error } = await supabase
      .from('successors')
      .select('*')
      .eq('founder_id', founderId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setSuccessors(data);
      setLoading(false);
    }
  };

  const subscribeToRealtimeUpdates = (founderId: string) => {
    const channel = supabase
      .channel('successor-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'successors',
          filter: `founder_id=eq.${founderId}`
        },
        (payload) => {
          console.log('🔔 Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setSuccessors(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setSuccessors(prev => 
              prev.map(s => s.id === payload.new.id ? payload.new : s)
            );
          } else if (payload.eventType === 'DELETE') {
            setSuccessors(prev => 
              prev.filter(s => s.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const deleteSuccessorSlot = async (successorId: string) => {
    if (!confirm('Are you sure you want to delete this successor slot? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('successors')
      .delete()
      .eq('id', successorId);

    if (error) {
      alert('Failed to delete successor slot');
      console.error(error);
    }
  };

  const getStatusBadge = (successor: any) => {
    const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
      active: { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300', label: 'Active' },
      accepted: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Accepted' },
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Pending' },
      invited: { icon: Clock, color: 'bg-purple-100 text-purple-800 border-purple-300', label: 'Invited' },
      revoked: { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-300', label: 'Revoked' },
      declined: { icon: XCircle, color: 'bg-gray-100 text-gray-800 border-gray-300', label: 'Declined' }
    };

    const config = statusConfig[successor.status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${config.color}`}>
        <Icon size={16} />
        <span className="text-sm font-semibold">{config.label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-blue-600 animate-pulse" size={48} />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <Shield className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Founder Dashboard</h1>
                <p className="text-slate-600 mt-1">Manage your succession plan</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-slate-700" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">Successor Slots</h2>
              <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                LIVE
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Status updates appear in real-time as successors accept or decline invitations
            </p>
          </div>

          {successors.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-slate-400" size={48} />
              <p className="text-slate-600">No successors designated yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {successors.map((successor) => (
                <div
                  key={successor.id}
                  className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {successor.full_name || 'Unnamed Successor'}
                      </h3>
                      <p className="text-sm text-slate-600">{successor.email}</p>
                    </div>
                    {getStatusBadge(successor)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    {successor.legal_accepted_at && (
                      <div>
                        <span className="text-slate-500">Accepted:</span>
                        <span className="ml-2 text-slate-900 font-medium">
                          {new Date(successor.legal_accepted_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {successor.legal_version && (
                      <div>
                        <span className="text-slate-500">Legal Version:</span>
                        <span className="ml-2 text-slate-900 font-medium">
                          {successor.legal_version}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteSuccessorSlot(successor.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <XCircle size={16} />
                    Delete Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
