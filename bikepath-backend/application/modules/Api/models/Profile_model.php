<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Profile_model extends CI_Model {
    public function get_profile($user_id) {
        $this->db->select('up.*, u.username, u.email');
        $this->db->from('user_profiles up');
        $this->db->join('users u', 'u.id = up.user_id');
        $this->db->where('up.user_id', $user_id);
        $profile = $this->db->get()->row();

        if (!$profile) {
            $this->db->insert('user_profiles', ['user_id' => $user_id]);
            return $this->get_profile($user_id);
        }
        return $profile;
    }

    public function update_profile($user_id, $data) {
        $this->db->where('user_id', $user_id);
        return $this->db->update('user_profiles', $data);
    }

    public function update_account($user_id, $data) {
        $this->db->where('id', $user_id);
        return $this->db->update('users', $data);
    }

    public function is_username_taken($username, $exclude_user_id) {
        $this->db->where('username', $username);
        $this->db->where('id !=', $exclude_user_id);
        return $this->db->get('users')->num_rows() > 0;
    }
}
