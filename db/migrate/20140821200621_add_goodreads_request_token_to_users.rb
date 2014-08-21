class AddGoodreadsRequestTokenToUsers < ActiveRecord::Migration
  def change
    add_column :users, :goodreads_request_token, :string
  end
end
