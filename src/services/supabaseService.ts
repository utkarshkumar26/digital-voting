
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Constituencies
export const getConstituencies = async () => {
  try {
    const { data, error } = await supabase
      .from('constituencies')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching constituencies:', error);
    toast.error('Failed to load constituencies');
    return [];
  }
};

export const getConstituencyByName = async (name: string) => {
  try {
    const { data, error } = await supabase
      .from('constituencies')
      .select('*')
      .eq('name', name)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching constituency:', error);
    return null;
  }
};

// Candidates
export const getCandidatesByConstituency = async (constituencyId: string) => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('constituency_id', constituencyId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    toast.error('Failed to load candidates');
    return [];
  }
};

// Voting
export const castVote = async (voterId: string, candidateId: string, constituencyId: string) => {
  try {
    // First, check if the user has already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('*')
      .eq('voter_id', voterId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingVote) {
      toast.error('You have already cast your vote');
      return false;
    }
    
    // Cast vote
    const { error } = await supabase
      .from('votes')
      .insert([
        { voter_id: voterId, candidate_id: candidateId, constituency_id: constituencyId }
      ]);
    
    if (error) throw error;
    
    // Update the voter's has_voted status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ has_voted: true })
      .eq('id', voterId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error casting vote:', error);
    toast.error('Failed to cast vote. Please try again.');
    return false;
  }
};

export const checkVoteStatus = async (voterId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('has_voted')
      .eq('id', voterId)
      .single();
    
    if (error) throw error;
    return data?.has_voted || false;
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
};

// User Profile
export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile');
    return false;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, constituencies(*)')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};
