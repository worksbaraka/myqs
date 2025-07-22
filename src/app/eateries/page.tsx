// /app/eateries/page.tsx
"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Heart,
  Filter,
  SlidersHorizontal,
  X,
} from 'lucide-react';

const EateryListingGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Campus Area');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');
  const [favorites, setFavorites] = useState(new Set());

  const eateries = [
    {
      id: 1,
      name: 'Campus Burger Hub',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      rating: 4.8,
      reviewCount: 234,
      cuisine: 'American',
      priceRange: '$',
      deliveryTime: '15-25 min',
      isOpen: true,
      distance: '0.3 km',
      featured: true,
      tags: ['Burgers', 'Fries', 'Shakes'],
    },
    {
      id: 2,
      name: 'Noodle Paradise',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewCount: 189,
      cuisine: 'Asian',
      priceRange: '$$',
      deliveryTime: '20-30 min',
      isOpen: true,
      distance: '0.5 km',
      featured: false,
      tags: ['Ramen', 'Stir-fry', 'Dumplings'],
    },
    {
      id: 3,
      name: 'Green Bowl Cafe',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      rating: 4.9,
      reviewCount: 156,
      cuisine: 'Healthy',
      priceRange: '$',
      deliveryTime: '10-20 min',
      isOpen: false,
      distance: '0.7 km',
      featured: true,
      tags: ['Salads', 'Bowls', 'Smoothies'],
    },
    {
      id: 4,
      name: 'Pizza Corner',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewCount: 298,
      cuisine: 'Italian',
      priceRange: '$',
      deliveryTime: '25-35 min',
      isOpen: true,
      distance: '1.2 km',
      featured: false,
      tags: ['Pizza', 'Pasta', 'Garlic Bread'],
    },
    {
      id: 5,
      name: 'Taco Fiesta',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewCount: 201,
      cuisine: 'Mexican',
      priceRange: '$$',
      deliveryTime: '15-25 min',
      isOpen: true,
      distance: '0.8 km',
      featured: false,
      tags: ['Tacos', 'Burritos', 'Nachos'],
    },
    {
      id: 6,
      name: 'Sushi Express',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      rating: 4.5,
      reviewCount: 167,
      cuisine: 'Japanese',
      priceRange: '$$',
      deliveryTime: '20-30 min',
      isOpen: true,
      distance: '1.5 km',
      featured: true,
      tags: ['Sushi', 'Rolls', 'Tempura'],
    },
  ];

  const cuisines = ['All', 'American', 'Asian', 'Italian', 'Mexican', 'Japanese', 'Healthy'];
  const priceRanges = ['All', '$', '$$', '$$$'];
  const ratings = ['All', '4.5+', '4.0+', '3.5+'];
  const sortOptions = ['Popular', 'Rating', 'Distance', 'Delivery Time'];

  const toggleFavorite = (id: number) => {
    const next = new Set(favorites);
    next.has(id) ? next.delete(id) : next.add(id);
    setFavorites(next);
  };

  const filteredEateries = eateries.filter((e) => {
    const cuisineOk = selectedCuisine === 'All' || e.cuisine === selectedCuisine;
    const priceOk = selectedPriceRange === 'All' || e.priceRange === selectedPriceRange;
    const ratingOk =
      selectedRating === 'All' ||
      (selectedRating === '4.5+' && e.rating >= 4.5) ||
      (selectedRating === '4.0+' && e.rating >= 4.0) ||
      (selectedRating === '3.5+' && e.rating >= 3.5);
    return cuisineOk && priceOk && ratingOk;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Foodie Grid
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-orange-600 font-medium">
                Explore
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Contact
              </a>
            </nav>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 font-medium">
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                  >
                    {cuisines.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                  >
                    {priceRanges.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                  >
                    {ratings.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                  >
                    {sortOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eateries in {location}</h1>
            <p className="text-gray-600 mt-1">{filteredEateries.length} restaurants found</p>
          </div>
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-0 bg-transparent text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEateries.map((eatery, idx) => (
            <Link href={`/eateries/${eatery.id}`} key={eatery.id}>
              <div
                className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                  eatery.featured ? 'ring-2 ring-orange-200' : ''
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={eatery.image}
                      alt={eatery.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {eatery.featured && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </div>
                      )}
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          eatery.isOpen
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {eatery.isOpen ? 'Open' : 'Closed'}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(eatery.id);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorites.has(eatery.id)
                            ? 'text-red-500 fill-current'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {eatery.name}
                      </h3>
                      <div className="text-sm text-gray-500">{eatery.distance}</div>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{eatery.rating}</span>
                        <span className="text-gray-500 text-sm">({eatery.reviewCount})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{eatery.priceRange}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{eatery.deliveryTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-orange-600 font-semibold">{eatery.cuisine}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {eatery.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredEateries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No eateries found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
            <button
              onClick={() => {
                setSelectedCuisine('All');
                setSelectedPriceRange('All');
                setSelectedRating('All');
                setSearchQuery('');
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {filteredEateries.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 font-medium">
              Load More Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EateryListingGrid;