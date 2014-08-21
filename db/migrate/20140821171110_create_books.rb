class CreateBooks < ActiveRecord::Migration
  def change
    create_table :books do |t|
      t.integer :user_id
      t.string :source
      t.string :title
      t.string :author
      t.string :genre
      t.string :published_date
      t.string :cover_url
      t.text :description
      t.timestamps
    end
  end
end
