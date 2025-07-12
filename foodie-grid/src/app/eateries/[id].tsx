// IndividualEateryPage
import React, { useState, useEffect } from 'react';
import {
  Star, Clock, DollarSign, Heart, Share2, Phone, MapPin, Globe,
  ChevronLeft, ChevronRight, User, ThumbsUp, ThumbsDown, Shield, Award, Truck
} from 'lucide-react';

const IndividualEateryPage = ({ params }: { params: { id: string } }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const eatery = {
    id: 1,
    name: "Campus Burger Hub",
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 234,
    cuisine: "American",
    priceRange: "$$",
    deliveryTime: "15-25 min",
    isOpen: true,
    openHours: "11:00 AM - 11:00 PM",
    distance: "0.3 km",
    address: "123 Campus Drive, University District",
    phone: "+1 (555) 123-4567",
    website: "campusburgerhub.com",
    description: "Your go-to spot for juicy burgers, crispy fries, and thick milkshakes.",
    features: ["Delivery", "Takeout", "Dine-in", "Student Discounts", "Late Night"],
    tags: ["Burgers", "Fries", "Shakes", "Wings", "Salads"],
    verified: true,
    featured: true
  };

  // Sample menu items
  const menuItems = [
    {
      id: 1,
      name: "Classic Burger",
      description: "Juicy beef patty with lettuce, tomato, onion, and special sauce",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
      category: "Burgers"
    },
    {
      id: 2,
      name: "Crispy Fries",
      description: "Golden crispy fries with sea salt",
      price: 6.99,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop",
      category: "Sides"
    },
    {
      id: 3,
      name: "Chocolate Shake",
      description: "Rich chocolate milkshake topped with whipped cream",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop",
      category: "Beverages"
    }
  ];

  // Sample reviews
  const reviews = [
    {
      id: 1,
      userName: "John Doe",
      rating: 5,
      date: "2 days ago",
      comment: "Amazing burgers! The best on campus by far.",
      helpful: 12,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      userName: "Sarah Wilson",
      rating: 4,
      date: "1 week ago",
      comment: "Great food and fast delivery. Highly recommend!",
      helpful: 8,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'menu', label: 'Menu' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'info', label: 'Info' }
  ];

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % eatery.images.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + eatery.images.length) % eatery.images.length);
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: eatery.name,
        text: `Check out ${eatery.name} on Foodie Grid!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderStars = (rating: number) => (
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ))
  );

  const handleReviewHelpful = (reviewId: number, isHelpful: boolean) => {
    console.log(`Review ${reviewId} marked as ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

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
              <a href="/eateries" className="text-orange-600 font-medium">Explore</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contact</a>
            </nav>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 font-medium">
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
        <img
          src={eatery.images[activeImageIndex]}
          alt={eatery.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {eatery.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Eatery Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{eatery.name}</h1>
                    {eatery.verified && (
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    )}
                    {eatery.featured && (
                      <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      {renderStars(eatery.rating)}
                      <span className="ml-1 font-medium">{eatery.rating}</span>
                      <span className="ml-1">({eatery.reviewCount} reviews)</span>
                    </div>
                    <span>{eatery.cuisine}</span>
                    <span>{eatery.priceRange}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{eatery.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isFavorite
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {eatery.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center text-green-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{eatery.deliveryTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{eatery.distance}</span>
                </div>
                <div className={`flex items-center ${eatery.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${eatery.isOpen ? 'bg-green-600' : 'bg-red-600'}`} />
                  <span>{eatery.isOpen ? 'Open' : 'Closed'}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        selectedTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {selectedTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">About</h3>
                      <p className="text-gray-700">{eatery.description}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Features</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {eatery.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'menu' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Menu Items</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {menuItems.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex space-x-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-orange-600">${item.price}</span>
                                <button className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors">
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Reviews</h3>
                      <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        {showAllReviews ? 'Show Less' : 'View All'}
                      </button>
                    </div>
                    <div className="space-y-4">
                      {reviews.slice(0, showAllReviews ? reviews.length : 2).map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-start space-x-3">
                            <img
                              src={review.avatar}
                              alt={review.userName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">{review.userName}</span>
                                <div className="flex">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => handleReviewHelpful(review.id, true)}
                                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>Helpful ({review.helpful})</span>
                                </button>
                                <button
                                  onClick={() => handleReviewHelpful(review.id, false)}
                                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  <span>Not Helpful</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === 'info' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-500" />
                          <span>{eatery.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <span>{eatery.address}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-gray-500" />
                          <a href={`https://${eatery.website}`} className="text-orange-600 hover:text-orange-700">
                            {eatery.website}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Hours</h3>
                      <p className="text-gray-700">{eatery.openHours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Order Now</h3>
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium mb-3">
                Start Order
              </button>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Free delivery on orders over $25</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{eatery.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-medium">{eatery.reviewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Time</span>
                  <span className="font-medium">{eatery.deliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-medium">{eatery.distance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-110">
          <Phone className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 md:hidden">
        <div className="flex space-x-4">
          <button
            onClick={toggleFavorite}
            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
              isFavorite
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium">
            Order Now
          </button>
        </div>
      </div>

      {/* Spacer for mobile CTA */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default IndividualEateryPage;