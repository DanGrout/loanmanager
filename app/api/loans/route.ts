import { NextResponse } from 'next/server'
import { loanOperations } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const loanId = searchParams.get('id')

    if (loanId) {
      const loan = await loanOperations.getLoanById(loanId)
      return NextResponse.json(loan)
    }

    if (userId) {
      const loans = await loanOperations.getLoansByUserId(userId)
      return NextResponse.json(loans)
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching loans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const loan = await loanOperations.createLoan(body)
    return NextResponse.json(loan)
  } catch (error) {
    console.error('Error creating loan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing loan ID' }, { status: 400 })
    }

    const body = await request.json()
    const updatedLoan = await loanOperations.updateLoan(id, body)
    return NextResponse.json(updatedLoan)
  } catch (error) {
    console.error('Error updating loan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing loan ID' }, { status: 400 })
    }

    await loanOperations.deleteLoan(id)
    return NextResponse.json({ message: 'Loan deleted successfully' })
  } catch (error) {
    console.error('Error deleting loan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 