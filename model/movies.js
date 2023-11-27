const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  genres: [
    {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  homepage: {
    type: String,
    required: true,
  },
  ido: {
    type: Number,
    required: true,
  },
  keywords: [
    {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  original_language: {
    type: String,
    required: true,
  },
  original_title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  popularity: {
    type: Number,
    required: true,
  },
  production_companies: [
    {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  production_countries: [
    {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  release_date: {
    type: String,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
  runtime: {
    type: Number,
    required: true,
  },
  spoken_languages: [
    {
      iso_639_1: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  vote_average: {
    type: Number,
    required: true,
  },
  vote_count: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Movies", movieSchema);
