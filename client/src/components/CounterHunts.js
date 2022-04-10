import React, { useState } from 'react';
import Counter from './Counter';
import Hunts from './Hunts';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';

export default function CounterHunts(props) {
    const [value, setValue] = useState('Counter');
    const [step, setStep] = useState(1);

    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} centered>
                            <Tab label="Counter" value="Counter" onClick={props.signedIn && props.activeTargetImg !== '' ? props.getActiveHunt : () => {}}/>
                            <Tab label="Hunts" value="Hunts" onClick={props.signedIn ? props.getHunts : () => {}}/>
                        </Tabs>
                    </Box>
                    <TabPanel value="Counter">
                        <Counter
                            activeTargetImg={props.activeTargetImg}
                            activeCounter={props.activeCounter}
                            setActiveCounter={props.setActiveCounter}
                            step={step}
                            getActiveHunt={props.getActiveHunt}
                            renderError={props.renderError}
                            clearError={props.clearError}
                            signedIn={props.signedIn}
                            apiUrl={props.apiUrl}
                        />
                    </TabPanel>
                    <TabPanel value="Hunts">
                        <Hunts
                            getPokemon={props.getPokemon}
                            revertDefault={props.revertDefault}
                            step={step}
                            setStep={setStep}
                            hunts={props.hunts}
                            getHunts={props.getHunts}
                            setHunts={props.setHunts}
                            activePokemon={props.activePokemon}
                            renderError={props.renderError}
                            clearError={props.clearError}
                            apiUrl={props.apiUrl}
                        />
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    )
}
