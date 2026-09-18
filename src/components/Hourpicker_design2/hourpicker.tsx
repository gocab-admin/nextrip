import React, { useMemo } from 'react'
import { DateObject } from 'react-multi-date-picker'
import {
  Select as BaseSelect,
  selectClasses,
  SelectProps,
  SelectRootSlotProps,
} from '@mui/base/Select';
import { styled } from "@mui/material";
import { Option as BaseOption, optionClasses } from '@mui/base/Option';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';

import { usePageContext } from "@/components/Providers/PageContext";

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const CustomButton = React.forwardRef(function CustomButton<
  TValue extends {},
  Multiple extends boolean,
>(
  props: SelectRootSlotProps<TValue, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ownerState, ...other } = props;
  return (
    <StyledButton type="button" {...other} ref={ref}>
      {other.children}
      <UnfoldMoreRoundedIcon />
    </StyledButton>
  );
});

const StyledButton = styled('button', { shouldForwardProp: () => true })(
  ({ theme }) => `
  position: relative;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  min-width: 320px;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: left;
  line-height: 1.5;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
  }

  &.${selectClasses.focusVisible} {
    outline: 0;
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  & > svg {
    font-size: 1rem;
    position: absolute;
    height: 100%;
    top: 0;
    right: 10px;
  }
  `,
);

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 320px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };
  `,
);

const Option = styled(BaseOption)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionClasses.highlighted} {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &:focus-visible {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }
  `,
);

const Popup = styled('div')`
  z-index: 1;
`;

const Select = React.forwardRef(function Select<
  TValue extends {},
  Multiple extends boolean,
>(props: SelectProps<TValue, Multiple>, ref: React.ForwardedRef<HTMLButtonElement>) {
  const slots: SelectProps<TValue, Multiple>['slots'] = {
    root: CustomButton,
    listbox: Listbox,
    // popup: Popup,
    ...props.slots,
  };

  return <BaseSelect {...props} ref={ref} slots={slots} />;
}) as <TValue extends {}, Multiple extends boolean>(
  props: SelectProps<TValue, Multiple> & React.RefAttributes<HTMLButtonElement>,
) => JSX.Element;


const hourinMilliSecond = 60 *60 * 1000;
export default function HourPicker({
  state,
  onChange,
  minDate,
  maxDate,
  highlightToday,
  dateChangeKey
}: any) {
  const {i18} = usePageContext();
  const {
    today = new DateObject(),
    onlyShowInRangeDates,
    year = 2021,
  } = state

  let minYear = today.year - 4

  minYear -= 12 * Math.ceil((minYear - year) / 12)

  const hoursList = useMemo(() => {
    const hours = []
    for (let i = 1; i <= 24; i++) {
      //@todo: Filter booked hours here
    hours.push(i)
    }
    return hours
  }, [dateChangeKey])
  
  // min Time
  const minDateInTime = minDate?.toJSON();
  const maxDateInTime = maxDate?.toJSON();
  // selected Date without Hour part
  const selectedTime = useMemo(()=>{
    return new DateObject(state?.date?.toDate()).setHour(0).setMinute(0).setSecond(0).toJSON();
  },[dateChangeKey])

  function selectHour(hour: any) {
    if (notInRange(hour)) return
    const date = new DateObject(state.date).setHour(hour)

    onChange(date, {
      ...state,
      date,
      mustShowYearPicker: false,
    })

  }

  function getClassName(hour: any) {
    const names = ['rmdp-day text-center']
    const { selectedDate } = state
    if (names.includes('rmdp-disabled') && onlyShowInRangeDates) return
    if (today.hour === hour && highlightToday) names.push('rmdp-today')
    // heighlight selected hour
  let selectedHour = selectedDate?.hour;
  if(selectedHour===0) {
    selectedHour = 24;
  }
    if (hour === selectedHour) {
      names.push('rmdp-range')
    }

    if (notInRange(hour)) names.push('rmdp-disabled')
    return names.join(' ')
  }

  function notInRange(hour: any) {
    
    const withHour = selectedTime + (hour * hourinMilliSecond);
    return ((minDateInTime+59*60*1000) > withHour) || (maxDateInTime < withHour);
  }

  const handleChangeHour = (e:any) => {
    const value = e.target.value || 0;
    selectHour(parseInt(value))
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: '18px', marginBottom: '8px', display: 'flex', columnGap: '8px', alignItems: 'center' }}>
      <div>{i18?.ROOMPAGE?.TIME || "Time"}</div>
      <select value={state?.selectedDate?.hour} onChange={handleChangeHour}>
        <option>Select Time</option>
      {hoursList.map((hour, i) => {
        const formatHour = new DateObject().setHour(hour).format('H:00');
        return (<option key={i} value={hour} disabled={notInRange(hour)}>{formatHour}</option>)
      })}
    </select>  
      </div>

    
    </div>
  )
}
