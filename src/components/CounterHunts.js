import React from 'react';
import Counter from './Counter';
import Hunts from './Hunts';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';

export default function CounterHunts(props) {
    const [value, setValue] = React.useState('Counter');

    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} centered>
                            <Tab label="Counter" value="Counter"/>
                            <Tab label="Hunts" value="Hunts"/>
                        </Tabs>
                    </Box>
                    <TabPanel value="Counter">
                        <Counter
                            activeTargetImg={props.activeTargetImg}
                            activeCounter={props.activeCounter}
                            setActiveCounter={props.setActiveCounter}
                            step={props.step}
                            setStep={props.setStep}
                            activeIndex={props.activeIndex}
                            hunts={props.hunts}
                            setHunts={props.setHunts}
                        />
                    </TabPanel>
                    <TabPanel value="Hunts">
                        <Hunts
                            getPokemon={props.getPokemon}
                            setActiveTarget={props.setActiveTarget}
                            activeCounter={props.activeCounter}
                            setActiveCounter={props.setActiveCounter}
                            revertDefault={props.revertDefault}
                            step={props.step}
                            setStep={props.setStep}
                            activeIndex={props.activeIndex}
                            updateHunt={props.updateHunt}
                            hunts={props.hunts}
                            setHunts={props.setHunts}
                            activePokemon={props.activePokemon}
                        />
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    )
}
