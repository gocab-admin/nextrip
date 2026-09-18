import Slider from "@mui/material/Slider";
import { styled } from '@mui/material/styles';

const PrettoSlider = styled(Slider)({
	color: '#232323',
	height: 4,
	'& .MuiSlider-track': {
		border: 'none'
	},
	'& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#232323',
        border: '2px solid #232323',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit'
        },
        '&:before': {
            display: 'none'
        }
	},
	'& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 14,
        background: 'unset',
        padding: 10,
        width: 'auto',
        height: 32,
        borderRadius: '50px',
        backgroundColor: '#232323',
        color: '#fff',
        '&:before': { 
            display: 'none' 
        }
	}
});

function valueLabelFormat(value: number) {
    return `${value} nights`;
}

const RangeSlider = (props:any)=>(
        <PrettoSlider
            step={1}
            min={1}
            max={30}
            aria-label="pretto slider"
            value={props.value}
            onChange={props.handleRangeChange}
            onChangeCommitted={props.handleRangeCommit}
            getAriaValueText={valueLabelFormat}
            valueLabelFormat={valueLabelFormat}
            valueLabelDisplay="auto"
        />
    )


export default RangeSlider;
