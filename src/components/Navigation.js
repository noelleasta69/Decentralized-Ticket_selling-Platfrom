import { ethers } from "ethers";
import { useState, useEffect } from "react";

const Navigation = ({
  account,
  setAccount,
  occasions,
  tokenMaster,
  provider,
  setOccasion,
}) => {
  // State variables
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    maxtickets: "",
    date: "",
    time: "",
    location: "",
  });

  // Function to add an event to the blockchain
  const addEvent = async () => {
    const signer = await provider.getSigner();
    const transaction = await tokenMaster
      .connect(signer)
      .list(
        formData.name,
        formData.cost,
        formData.maxtickets,
        formData.date,
        formData.time,
        formData.location
      );
    await transaction.wait();
  };

  // Function to handle connecting to the wallet
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  // Function to handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add form data to occasions array
      setOccasion((prevOccasions) => ({
        ...prevOccasions,
        occasions: formData,
      }));

      // Reset form data
      setFormData({
        name: "",
        cost: "",
        maxtickets: "",
        date: "",
        time: "",
        location: "",
      });

      // Add event to the blockchain
      await addEvent();

      console.log("Event added successfully!");
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Function to toggle showing the form
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <nav>
      <div className="nav__brand">
        <ul className="nav__links">
          <li>
            {/* Button to toggle showing form */}
            <button className="button" onClick={toggleForm}>
              Add Event
            </button>
            {/* Form to add new event */}
            {showForm && (
              <div className="dropdown">
                <form className="form-container" onSubmit={handleSubmit}>
                  {/* Form inputs */}
                  {/* Event Name */}
                  <div>
                    <label htmlFor="name">Event Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Event Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Cost */}
                  <div>
                    <label htmlFor="email">Cost</label>
                    <input
                      type="number"
                      id="email"
                      name="cost"
                      placeholder="Cost"
                      value={formData.cost}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Total Tickets */}
                  <div>
                    <label htmlFor="number">Total Tickets</label>
                    <input
                      type="number"
                      id="password"
                      name="maxtickets"
                      placeholder="Total Tickets"
                      value={formData.maxtickets}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Date */}
                  <div>
                    <label htmlFor="confirmPassword">Date</label>
                    <input
                      type="text"
                      id="confirmPassword"
                      name="date"
                      placeholder="dd-mm-yyyy"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Time */}
                  <div>
                    <label htmlFor="address">Time</label>
                    <input
                      type="text"
                      id="address"
                      name="time"
                      placeholder="Time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Location */}
                  <div>
                    <label htmlFor="phoneNumber">Location</label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="location"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Submit button */}
                  <button onClick={handleSubmit}>Submit</button>
                </form>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Wallet connection button */}
      {account ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;
