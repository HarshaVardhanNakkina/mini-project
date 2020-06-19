import React from 'react'

export default function MovieCard({ movie }) {
	return (
		<div className="card">
      {/* style={{backgroundImage: `url(https://image.tmdb.org/t/p/w400/${movie.backdrop_path})`}} */}
			<img
				src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`}
				alt={`${movie.title} poster`}
				className="card--image"
			/>
			<div className="card--content">
				<h3 className="card--title"></h3>
				<p>
					<small>Release Date: {movie.release_date}</small>
				</p>
				<p>
					<small>Rating: {movie.vote_average}</small>
				</p>
				<p className="card--desc">{movie.overview}</p>
			</div>
		</div>
	)
}
