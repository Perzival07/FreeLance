import { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const Profile = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
    },
    defaultDistance: '',
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/user/profile`,
        {},
        { headers: { token } }
      );

      if (response.data.success && response.data.user) {
        const user = response.data.user;
        if (user.profile) {
          setProfile({
            firstName: user.profile.firstName || '',
            lastName: user.profile.lastName || '',
            phone: user.profile.phone || '',
            address: {
              street: user.profile.address?.street || '',
              city: user.profile.address?.city || '',
              state: user.profile.address?.state || '',
              zipcode: user.profile.address?.zipcode || '',
              country: user.profile.address?.country || '',
            },
            defaultDistance: user.profile.defaultDistance || '',
          });
        } else {
          // If profile doesn't exist, try to extract name
          if (user.name) {
            const nameParts = user.name.split(' ');
            setProfile(prev => ({
              ...prev,
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
            }));
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [token, backendUrl]);

  // Fetch user profile on component mount
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token, navigate, fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await axios.post(
        `${backendUrl}/user/update-profile`,
        { profile },
        { headers: { token } }
      );

      if (response.data.success) {
        // Update profile state from response data
        if (response.data.user?.profile) {
          const userProfile = response.data.user.profile;
          setProfile({
            firstName: userProfile.firstName || '',
            lastName: userProfile.lastName || '',
            phone: userProfile.phone || '',
            address: {
              street: userProfile.address?.street || '',
              city: userProfile.address?.city || '',
              state: userProfile.address?.state || '',
              zipcode: userProfile.address?.zipcode || '',
              country: userProfile.address?.country || '',
            },
            defaultDistance: userProfile.defaultDistance?.toString() || '',
          });
        }
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-ivory-400 font-display text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] border-t hairline-gold pt-10">
      <div className="text-center text-2xl mb-8">
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card-luxury p-6 rounded-lg mb-4">
          <p className="text-sm text-ivory-300">
            Save your details here to make checkout faster. Your information will be pre-filled when placing orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="card-luxury rounded-lg p-6">
            <h2 className="font-display text-2xl text-gold-gradient mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ivory-200 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 rounded py-2 px-3 outline-none focus:border-gold-400 transition-colors"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-200 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 rounded py-2 px-3 outline-none focus:border-gold-400 transition-colors"
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-200 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 rounded py-2 px-3 outline-none focus:border-gold-400 transition-colors"
                  placeholder="+91 12345 67890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ivory-200 mb-1">
                  Default Distance from Store (km)
                </label>
                <input
                  type="number"
                  name="defaultDistance"
                  value={profile.defaultDistance}
                  onChange={handleChange}
                  className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 rounded py-2 px-3 outline-none focus:border-gold-400 transition-colors"
                  placeholder="Distance in km"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-ivory-400 mt-1">This will be pre-filled during checkout</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="card-luxury rounded-lg p-6">
            <h2 className="font-display text-2xl text-gold-gradient mb-4">Address Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ivory-200 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={profile.address.street}
                  onChange={handleChange}
                  className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 rounded py-2 px-3 outline-none focus:border-gold-400 transition-colors"
                  placeholder="Street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ivory-200 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={profile.address.city}
                    onChange={handleChange}
                    className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 rounded py-2 px-3 outline-none focus:border-gold-400 transition-colors"
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ivory-200 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={profile.address.state}
                    onChange={handleChange}
                    className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 rounded py-2 px-3 outline-none focus:border-gold-400 transition-colors"
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ivory-200 mb-1">
                    Zip/Postal Code *
                  </label>
                  <input
                    type="text"
                    name="address.zipcode"
                    value={profile.address.zipcode}
                    onChange={handleChange}
                    className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 rounded py-2 px-3 outline-none focus:border-gold-400 transition-colors"
                    placeholder="Zip code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ivory-200 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={profile.address.country}
                    onChange={handleChange}
                    className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 rounded py-2 px-3 outline-none focus:border-gold-400 transition-colors"
                    placeholder="Country"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-gold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-gold-outline rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

