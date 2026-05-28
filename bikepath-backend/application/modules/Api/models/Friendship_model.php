<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Friendship_model extends CI_Model {
    public function get_friends($user_id) {
        $this->db->select('users.id, users.username, user_profiles.avatar');
        $this->db->from('friendships');
        $this->db->join('users', 'users.id = friendships.friend_id');
        $this->db->join('user_profiles', 'user_profiles.user_id = users.id', 'left');
        $this->db->where('friendships.user_id', $user_id);
        return $this->db->get()->result();
    }

    public function follow($user_id, $friend_id) {
        $data = ['user_id' => $user_id, 'friend_id' => $friend_id];
        return $this->db->replace('friendships', $data);
    }

    public function unfollow($user_id, $friend_id) {
        return $this->db->delete('friendships', ['user_id' => $user_id, 'friend_id' => $friend_id]);
    }
}
