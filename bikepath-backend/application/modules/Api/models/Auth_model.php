<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth_model extends CI_Model {

    private $table = 'users';

    public function get_user_by_email($email)
    {
        return $this->db->get_where($this->table, ['email' => $email])->row();
    }

    public function register_user($data)
    {
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }
    
    public function get_user_by_id($id)
    {
        return $this->db->get_where($this->table, ['id' => $id])->row();
    }

    public function get_all_users($exclude_user_id) {
        $this->db->select('users.id, users.username, user_profiles.avatar');
        $this->db->from('users');
        $this->db->join('user_profiles', 'user_profiles.user_id = users.id', 'left');
        $this->db->where('users.id !=', $exclude_user_id);
        return $this->db->get()->result();
    }
}
