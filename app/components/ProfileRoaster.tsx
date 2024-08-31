import { useState } from 'react';

const ProfileRoaster = () => {
  const [url, setUrl] = useState('');
  const [profileData, setProfileData] = useState<any>(null);
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProfileData = async (profileUrl: string) => {
    try {
      const response = await fetch('https://api.scrapin.io/enrichment/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.SCRAPIN_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleRoast = async () => {
    setLoading(true);
    try {
      const data = await fetchProfileData(url);
      setProfileData(data);

      if (!data) {
        setRoast("Couldn't fetch profile data. Please try again.");
        setLoading(false);
        return;
      }

      const response = await fetch('/api/generateRoast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileData: data.person }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate roast');
      }

      const roastData = await response.json();
      setRoast(roastData.roast);
    } catch (error) {
      console.error(error);
      setRoast("Oops! Our roast-o-matic machine is taking a coffee break. Try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Profile Roaster</h1>
      <input
        type="url"
        placeholder="https://www.linkedin.com/in/username"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={handleRoast}
        disabled={loading || !url}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {loading ? 'Roasting in progress...' : 'Roast this profile!'}
      </button>
      {roast && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold">Roast Result:</h2>
          <p className="mt-2 text-gray-700">{roast}</p>
        </div>
      )}
      {profileData && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold">Profile Data:</h2>
          <p className="mt-2 text-gray-700">Name: {profileData.person.firstName} {profileData.person.lastName}</p>
          <p className="mt-2 text-gray-700">Headline: {profileData.person.headline}</p>
          <img src={profileData.person.photoUrl} alt="Profile" className="mt-2 rounded-full w-24 h-24" />
        </div>
      )}
    </div>
  );
};

export default ProfileRoaster;
