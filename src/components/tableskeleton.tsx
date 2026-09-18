import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

const TableSkeleton = () => (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {Array.from(Array(12)).map((item: any, index: any) => (
                <TableCell key={index}>
                  <h3 className="card-title placeholder-glow mt-4">
                    <span className="placeholder col-12"></span>
                  </h3>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {Array.from(Array(12)).map((item: any, index: any) => (
                <TableCell key={index}>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-12"></span>
                  </p>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div className="mt-3">
        <p className="card-text placeholder-glow d-flex justify-content-end">
          <span className="placeholder col-4"></span>
        </p>
      </div>
    </div>
  );

export default TableSkeleton;
