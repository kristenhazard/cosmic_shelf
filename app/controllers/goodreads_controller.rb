class GoodreadsController < ApplicationController
  before_filter :authenticate_user!

  def authorize
    $request_token = nil
    consumer = OAuth::Consumer.new(
      Goodreads.configuration[:api_key],
      Goodreads.configuration[:api_secret],
      :site => 'http://www.goodreads.com')
    $request_token = consumer.get_request_token
    oauth_url = $request_token.authorize_url(:oauth_callback => goodreads_populate_shelf_url)
    redirect_to(oauth_url)
  end

  def populate_shelf
    access_token = $request_token.get_access_token
    @goodreads_client = Goodreads.new(oauth_token: access_token)
    puts "access_token=" + "#{access_token}"
    client_id = @goodreads_client.user_id
    shelf = @goodreads_client.shelf(client_id, 'all')
    shelf[:books].each do |goodreads_book_profile|
      cosmicshelf_book_profile = Book.new

      # VERSION 1
      #cosmicshelf_book_profile.user_id = current_user.id
      #cosmicshelf_book_profile.source = 'goodreads'
      #cosmicshelf_book_profile.title = goodreads_book_profile[:book][:title]
      #cosmicshelf_book_profile.author = goodreads_book_profile[:book][:authors][:author][:name]
      #cosmicshelf_book_profile.genre = get_genres(goodreads_book_profile)
      #cosmicshelf_book_profile.published_date = goodreads_book_profile[:book][:publication_year]
      #cosmicshelf_book_profile.cover_url = goodreads_book_profile[:book][:image_url] 
      #cosmicshelf_book_profile.description = goodreads_book_profile[:book][:description]
      #cosmicshelf_book_profile.save

      # VERSION 2
      isbn = goodreads_book_profile[:book][:isbn]
      actual_profile = @goodreads_client.book_by_isbn(isbn)
      cosmicshelf_book_profile.user_id = current_user.id
      cosmicshelf_book_profile.source = 'goodreads'
      cosmicshelf_book_profile.title = actual_profile[:work][:original_title]
      cosmicshelf_book_profile.author = actual_profile[:authors][:author][:name]
      cosmicshelf_book_profile.genre = get_genres(actual_profile)
      cosmicshelf_book_profile.published_date = actual_profile[:work][:original_publication_year]
      cosmicshelf_book_profile.cover_url = actual_profile[:image_url]
      cosmicshelf_book_profile.description = clean_up_description(actual_profile[:description])
      cosmicshelf_book_profile.save
    end
    redirect_to(bookshelf_index_url)
  end

  def get_genres(actual_profile)
    genres = ''
    actual_profile[:popular_shelves][:shelf].each do |category|
      genre = category[:name]
      genres = genres + genre + ', ' if verify_genre(genre) 
    end
    genres[-1] = '' 
    genres[-1] = '' 
    return genres
  end

  def verify_genre(genre)
    case genre
    when 'currently-reading',       
         'to-read', 
         'read',
         'favorites',
         'nonfiction',
         'non-fiction',
         'fiction',
         'classics'
      return false
    else
       return true
    end
  end

  def clean_up_description(description)
    if description == nil
      return nil
    else
      description = description.gsub('<br>', '')
      description = description.gsub('</br>', '')
      description = description.gsub('<em>', '')
      description = description.gsub('</em>', '')
      return description
    end
  end
end
