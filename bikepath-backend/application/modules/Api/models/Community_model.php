<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Community_model extends CI_Model {
    public function get_all_groups($user_id) {
        $this->db->select('c.*, (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as member_count, 
                          (SELECT COUNT(*) FROM community_members WHERE community_id = c.id AND user_id = ' . $this->db->escape($user_id) . ') as is_member');
        $this->db->from('communities c');
        return $this->db->get()->result();
    }

    public function get_members($community_id) {
        $this->db->select('users.username, user_profiles.avatar, user_profiles.cycling_level');
        $this->db->from('community_members');
        $this->db->join('users', 'users.id = community_members.user_id');
        $this->db->join('user_profiles', 'user_profiles.user_id = users.id', 'left');
        $this->db->where('community_id', $community_id);
        return $this->db->get()->result();
    }

    public function join_group($community_id, $user_id) {
        $data = ['community_id' => $community_id, 'user_id' => $user_id];
        return $this->db->replace('community_members', $data);
    }

    public function leave_group($community_id, $user_id) {
        return $this->db->delete('community_members', ['community_id' => $community_id, 'user_id' => $user_id]);
    }

    public function get_messages($community_id) {
        $this->db->select('community_messages.*, users.username');
        $this->db->from('community_messages');
        $this->db->join('users', 'users.id = community_messages.user_id');
        $this->db->where('community_id', $community_id);
        $this->db->order_by('created_at', 'ASC');
        return $this->db->get()->result();
    }

    public function send_message($community_id, $user_id, $message) {
        return $this->db->insert('community_messages', [
            'community_id' => $community_id,
            'user_id'      => $user_id,
            'message'      => $message
        ]);
    }
}
