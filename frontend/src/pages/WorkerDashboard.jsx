import React from 'react';
import { HardHat, Calendar, DollarSign, Award, Clock, CheckCircle2, FileText, AlertCircle, ShieldCheck, Download } from 'lucide-react';

export default function WorkerDashboard({ user }) {
  const workerName = user?.name || 'Ramesh Yadav';
  const empId = user?.emp_id || 'EMP-1001';

  const attendanceStats = {
    daysAttended: 22,
    totalWorkingDays: 25,
    attendanceRate: 88,
    leavesTaken: 3,
    shift: 'Shift A (06:00 - 14:00)',
    healthStatus: 'Fit for Underground Duty'
  };

  const salaryDetails = {
    month: 'September 2026',
    basePay: 28000,
    overtimePay: 6500,
    safetyBonus: 4000,
    grossSalary: 38500,
    pfDeduction: 2100,
    netPay: 36400,
    status: 'Paid (Direct Transfer)'
  };

  const shiftLogs = [
    { date: '2026-09-18', shift: 'Shift A (06:00 - 14:00)', inTime: '05:50 AM', outTime: '02:05 PM', status: 'Present', location: 'Korba Pit Bench 4' },
    { date: '2026-09-17', shift: 'Shift A (06:00 - 14:00)', inTime: '05:55 AM', outTime: '02:00 PM', status: 'Present', location: 'Korba Pit Bench 4' },
    { date: '2026-09-16', shift: 'Shift A (06:00 - 14:00)', inTime: '05:48 AM', outTime: '02:10 PM', status: 'Present', location: 'Korba Pit Bench 3' },
    { date: '2026-09-15', shift: 'Shift A (06:00 - 14:00)', inTime: '-', outTime: '-', status: 'On Leave', location: 'Sanctioned Casual Leave' },
    { date: '2026-09-14', shift: 'Shift A (06:00 - 14:00)', inTime: '05:52 AM', outTime: '02:00 PM', status: 'Present', location: 'Korba Pit Bench 2' }
  ];

  return (
    <div className="space-y-6">
      {/* Worker Greeting Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md shrink-0">
            <HardHat className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">{workerName}</h2>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                ID: {empId}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Excavator Operator • Operations Team • Korba Mine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-emerald-900 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fit for work: {attendanceStats.healthStatus}</span>
        </div>
      </div>

      {/* Worker Perspective Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Days Attended */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Days at Work</p>
              <h3 className="text-3xl font-bold text-blue-700 mt-1 font-['Outfit']">
                {attendanceStats.daysAttended} <span className="text-xs text-slate-500 font-normal">/ {attendanceStats.totalWorkingDays} Days</span>
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>You attended {attendanceStats.attendanceRate}% of your shifts</span>
          </p>
        </div>

        {/* Net Take-Home Salary */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pay This Month</p>
              <h3 className="text-3xl font-bold text-emerald-700 mt-1 font-['Outfit']">
                ₹{salaryDetails.netPay.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Status: {salaryDetails.status}</span>
          </p>
        </div>

        {/* Safety & Overtime Bonus */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Extra Pay</p>
              <h3 className="text-3xl font-bold text-amber-700 mt-1 font-['Outfit']">
                ₹{(salaryDetails.overtimePay + salaryDetails.safetyBonus).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">
            Zero Safety Incidents Reward Applied
          </p>
        </div>

        {/* Assigned Shift */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-purple-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Shift</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1 font-['Outfit']">
                {attendanceStats.shift}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-semibold">
            Next Shift: Tomorrow 06:00 AM
          </p>
        </div>
      </div>

      {/* Salary & Payslip Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detailed Payroll Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Salary Breakdown — {salaryDetails.month}</h3>
              <p className="text-xs text-slate-500 font-medium">Your pay, extra work pay, and deductions</p>
            </div>

            <button className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition">
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Download Pay Slip
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-slate-500 font-bold uppercase text-[10px]">Money You Earned</p>
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Basic Wage:</span>
                <span className="text-slate-900 font-bold">₹{salaryDetails.basePay.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Overtime Allowance (26 hrs):</span>
                <span className="text-slate-900 font-bold">₹{salaryDetails.overtimePay.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Mine Hazard Safety Allowance:</span>
                <span className="text-slate-900 font-bold">₹{salaryDetails.safetyBonus.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900">
                <span>Gross Earnings:</span>
                <span>₹{salaryDetails.grossSalary.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-slate-500 font-bold uppercase text-[10px]">Money Taken From Pay</p>
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Retirement savings:</span>
                <span className="text-rose-700 font-bold">- ₹1,800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Labour Welfare Fund:</span>
                <span className="text-rose-700 font-bold">- ₹300</span>
              </div>
              <div className="pt-6 border-t border-slate-200 flex justify-between font-extrabold text-emerald-800 text-sm">
                <span>Net Salary Paid:</span>
                <span>₹{salaryDetails.netPay.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Health & Safety Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Medical Fitness & PPE Record</h3>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-bold">Annual Medical Examination:</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PASSED</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-bold">Safety Helmet & Respirator Issue:</span>
                <span className="font-bold text-slate-900">Issued (Aug 2026)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-bold">First Aid Refresher Training:</span>
                <span className="font-bold text-slate-900">Completed (Jul 2026)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
            💡 Worker Tip: Ensure your biometrically verified check-in occurs at least 10 minutes prior to Shift A start.
          </div>
        </div>
      </div>

      {/* Shift Logs Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-['Outfit']">My Attendance History (Past Benches & Shifts)</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-bold">Shift Date</th>
                <th className="pb-3 font-bold">Shift Name</th>
                <th className="pb-3 font-bold">Check-In Time</th>
                <th className="pb-3 font-bold">Check-Out Time</th>
                <th className="pb-3 font-bold">Work Location</th>
                <th className="pb-3 font-bold">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {shiftLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-bold text-slate-900">{log.date}</td>
                  <td className="py-3 text-slate-700">{log.shift}</td>
                  <td className="py-3 text-slate-800 font-semibold">{log.inTime}</td>
                  <td className="py-3 text-slate-800 font-semibold">{log.outTime}</td>
                  <td className="py-3 text-slate-700 font-semibold">{log.location}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                      log.status === 'Present'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
