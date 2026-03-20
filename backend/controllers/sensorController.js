// A standard Controller function
const getSensorHistory = async (req, res) => {
    try {
        // 1. Controller asks the database for the last 6 data points
        // const history = await Database.find({ ... }) 
        
        // Mock data for the example
        const history = [
            { time: '10:00', waterLevel: 20, rainIntensity: 5 },
            { time: '10:15', waterLevel: 25, rainIntensity: 15 }
        ];

        // 2. Controller successfully sends the data back to React
        res.status(200).json({
            success: true,
            data: history
        });

    } catch (error) {
        // 3. Controller handles any errors so the server doesn't crash
        res.status(500).json({
            success: false,
            message: "Failed to fetch sensor history"
        });
    }
};

module.exports = { getSensorHistory };